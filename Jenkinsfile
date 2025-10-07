pipeline {
    agent any

    tools {
        nodejs "22.20.0" // Ensure Node.js 22.20.0 is installed
    }

    options {
        timeout(time: 2, unit: 'MINUTES') // Timeout after 2 minutes
    }

    // Stages for the pipeline 
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}