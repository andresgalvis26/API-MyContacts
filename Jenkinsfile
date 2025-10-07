pipeline {
    agent {
        docker {
            image 'node:22-alpine'
            // args '-p 3000:3000'
        }
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
        // stage('Build') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }
    }
}