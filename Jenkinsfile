pipeline {
    agent any

    triggers {
        // Run every day at 6:00 PM
        cron('0 18 * * *')

        // Run whenever code is pushed to GitHub
        githubPush()
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            emailext(
                subject: "Playwright Test Report - Build #${BUILD_NUMBER} - ${currentBuild.currentResult}",
                body: """
Hello Neel,

Playwright automation execution is completed.

Build Number: ${BUILD_NUMBER}
Build Status: ${currentBuild.currentResult}

Jenkins Build:
${BUILD_URL}

Regards,
Jenkins
                """,
                to: 'neelgaganat97@gmail.com'
            )
        }
    }
}
