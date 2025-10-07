pipeline {
    agent any

    tools {
        nodejs "22.20.0"
    }

    stages {
        stage('Clean Install') {
            steps {
                sh 'rm -rf node_modules package-lock.json && npm ci'
            }
        }
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
    }
}