import { CandidateLocator, ElementDefinition } from './types';
import { historyManager } from './history';
import { locatorRepository } from './locator-repository';

/**
 * Generates and ranks fallback candidate locators using semantic patterns,
 * historical learning, repository declarations, and contextual constraints.
 */
export class LocatorStrategyEngine {
  /**
   * Builds an ordered list of candidate locators to attempt.
   */
  public static generateCandidates(
    def: ElementDefinition,
    testName?: string
  ): CandidateLocator[] {
    const candidates: CandidateLocator[] = [];
    const seen = new Set<string>();

    const addCandidate = (cand: CandidateLocator) => {
      const normalized = cand.selector.trim();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      candidates.push(cand);
    };

    // 1. Primary locator (Confidence: 1.0)
    addCandidate({
      selector: def.primary,
      source: 'primary',
      confidence: 1.0,
      strategyDescription: 'Original primary locator',
      contextSelector: def.contextSelector,
    });

    // 2. Previously learned healed locator from History (Confidence: 0.95 - 0.99)
    const elementKey = `${def.page || 'GenericPage'}.${def.name}`;
    const learned = historyManager.getLearnedCandidate(elementKey);
    if (learned && learned.healed !== def.primary) {
      addCandidate({
        selector: learned.healed,
        source: 'history',
        confidence: Math.max(0.92, learned.confidence),
        strategyDescription: `Learned from prior successful healing (success count: ${learned.success_count})`,
        contextSelector: def.contextSelector,
      });
    }

    // 3. Registered repository fallbacks
    const repoDef = locatorRepository.get(def.name, def.page);
    const declaredFallbacks = [
      ...(def.fallbacks || []),
      ...(repoDef?.fallbacks || []),
    ];

    for (let i = 0; i < declaredFallbacks.length; i++) {
      const fb = declaredFallbacks[i];
      addCandidate({
        selector: fb,
        source: 'repository',
        confidence: Math.max(0.7, 0.9 - i * 0.05),
        strategyDescription: `Pre-declared repository fallback #${i + 1}`,
        contextSelector: def.contextSelector,
      });
    }

    // 4. Synthesize semantic fallbacks from attributes / selector tokens
    const semanticFallbacks = this.synthesizeSemanticCandidates(def);
    for (const sem of semanticFallbacks) {
      addCandidate(sem);
    }

    // 5. If a contextual selector is provided, generate scoped variations
    if (def.contextSelector) {
      const scopedCandidates: CandidateLocator[] = [];
      for (const c of candidates) {
        if (!c.selector.startsWith(def.contextSelector)) {
          scopedCandidates.push({
            selector: `${def.contextSelector} >> ${c.selector}`,
            source: c.source,
            confidence: c.confidence * 0.98,
            strategyDescription: `Context-scoped: within [${def.contextSelector}]`,
            contextSelector: def.contextSelector,
          });
        }
      }
      scopedCandidates.forEach((sc) => addCandidate(sc));
    }

    return candidates;
  }

  /**
   * Intelligently parses selector tokens, IDs, texts, roles, and accessible names
   * to construct high-probability semantic alternatives.
   */
  private static synthesizeSemanticCandidates(def: ElementDefinition): CandidateLocator[] {
    const list: CandidateLocator[] = [];
    const selector = def.primary;

    // Helper
    const add = (sel: string, conf: number, desc: string) => {
      list.push({
        selector: sel,
        source: 'semantic',
        confidence: conf,
        strategyDescription: desc,
        contextSelector: def.contextSelector,
      });
    };

    // Extract ID (e.g. from '#submitBtn' or '[id="submitBtn"]')
    const idMatch = selector.match(/(?:#|id=['"])([a-zA-Z0-9_\-]+)['"]/i);
    const rawId = idMatch ? idMatch[1] : undefined;

    if (rawId) {
      // Data test ID variations
      add(`[data-testid="${rawId}"]`, 0.92, 'data-testid from element id');
      add(`[data-test="${rawId}"]`, 0.90, 'data-test from element id');
      add(`[data-qa="${rawId}"]`, 0.88, 'data-qa from element id');
      // Normalized name or class
      add(`[name="${rawId}"]`, 0.85, 'name attribute matching id');
    }

    // Extract accessible name or role
    if (def.role && def.accessibleName) {
      add(
        `role=${def.role}[name="${def.accessibleName}"]`,
        0.91,
        `Playwright ARIA role [${def.role}] and accessible name [${def.accessibleName}]`
      );
    }

    // Extract visible text (e.g. button:has-text("Submit") or text="Submit")
    const textTarget = def.text || def.accessibleName || this.extractTextFromSelector(selector);
    if (textTarget) {
      const cleanText = textTarget.trim();
      if (def.tag) {
        add(`${def.tag}:has-text("${cleanText}")`, 0.85, `Tag [${def.tag}] with visible text`);
      }
      add(`text="${cleanText}"`, 0.82, 'Exact visible text');
      add(`:text-is("${cleanText}")`, 0.80, 'Case-sensitive exact text match');
      add(`button:has-text("${cleanText}")`, 0.78, 'Button with visible text');
      add(`a:has-text("${cleanText}")`, 0.75, 'Anchor link with visible text');
    }

    // Extract placeholder (e.g. from input[placeholder="Username"])
    const placeholderMatch = selector.match(/placeholder=['"]([^'"]+)['"]/i);
    if (placeholderMatch) {
      const ph = placeholderMatch[1];
      add(`input[placeholder="${ph}"]`, 0.84, 'Input placeholder exact match');
      add(`[placeholder*="${ph}" i]`, 0.76, 'Case-insensitive partial placeholder match');
    }

    // Extract name attribute (e.g. from input[name="username"])
    const nameMatch = selector.match(/name=['"]([^'"]+)['"]/i);
    if (nameMatch) {
      const nm = nameMatch[1];
      add(`[name="${nm}"]`, 0.86, 'Name attribute exact match');
      add(`[data-testid*="${nm}" i]`, 0.80, 'data-testid partial match from name');
    }

    // Extract aria-label (e.g. [aria-label="Close"])
    const ariaMatch = selector.match(/aria-label=['"]([^'"]+)['"]/i);
    if (ariaMatch) {
      const al = ariaMatch[1];
      add(`[aria-label="${al}"]`, 0.88, 'Exact aria-label match');
      add(`[aria-label*="${al}" i]`, 0.78, 'Partial aria-label match');
    }

    // Playwright getByRole style strings (e.g. getByRole('button', { name: 'Login' }))
    const roleMatch = selector.match(/getByRole\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*name:\s*['"]([^'"]+)['"]\s*\}\s*\)/i);
    if (roleMatch) {
      const [, role, rName] = roleMatch;
      add(`role=${role}[name="${rName}"]`, 0.93, 'Role selector derived from getByRole call');
      add(`${role}:has-text("${rName}")`, 0.85, 'Tag has-text derived from getByRole');
    }

    // Playwright getByPlaceholder style strings
    const getByPhMatch = selector.match(/getByPlaceholder\(\s*['"]([^'"]+)['"]\s*\)/i);
    if (getByPhMatch) {
      const ph = getByPhMatch[1];
      add(`[placeholder="${ph}"]`, 0.88, 'Placeholder derived from getByPlaceholder');
      add(`input[placeholder*="${ph}" i]`, 0.82, 'Input partial placeholder derived from getByPlaceholder');
    }

    return list;
  }

  private static extractTextFromSelector(selector: string): string | undefined {
    const hasTextMatch = selector.match(/:has-text\(['"]([^'"]+)['"]\)/i);
    if (hasTextMatch) return hasTextMatch[1];

    const textEqualMatch = selector.match(/text=['"]([^'"]+)['"]/i);
    if (textEqualMatch) return textEqualMatch[1];

    const containsMatch = selector.match(/:contains\(['"]([^'"]+)['"]\)/i);
    if (containsMatch) return containsMatch[1];

    return undefined;
  }
}
