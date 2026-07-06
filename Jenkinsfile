pipeline {
  agent any

  parameters {
    string(name: 'VITE_V3RII_API_BASE_URL', defaultValue: 'https://api.v3rii.com', description: 'Frontend build sırasında kullanılacak V3RII API adresi')
  }

  environment {
    VITE_V3RII_API_BASE_URL = "${params.VITE_V3RII_API_BASE_URL}"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
  }
}
