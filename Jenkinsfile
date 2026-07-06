pipeline {
  agent any

  parameters {
    string(name: 'VITE_V3RII_API_BASE_URL', defaultValue: 'https://veriiapi.v3rii.com', description: 'Frontend build sırasında kullanılacak V3RII API adresi')
    string(name: 'DEPLOY_PATH', defaultValue: 'C:\\inetpub\\wwwroot\\v3rii.com', description: 'IIS website publish klasörü')
    string(name: 'APP_POOL_NAME', defaultValue: 'v3rii.com', description: 'IIS AppPool adı')
  }

  environment {
    VITE_V3RII_API_BASE_URL = "${params.VITE_V3RII_API_BASE_URL}"
  }

  stages {
    stage('Install') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        bat 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }

    stage('Ensure AppPool Stopped') {
      steps {
        powershell '''
          Import-Module WebAdministration
          if (Test-Path "IIS:\\AppPools\\$env:APP_POOL_NAME") {
            $state = (Get-WebAppPoolState -Name $env:APP_POOL_NAME).Value
            if ($state -ne "Stopped") {
              Stop-WebAppPool -Name $env:APP_POOL_NAME
            }
          }
        '''
      }
    }

    stage('Deploy') {
      steps {
        powershell '''
          if (!(Test-Path $env:DEPLOY_PATH)) {
            New-Item -ItemType Directory -Force -Path $env:DEPLOY_PATH | Out-Null
          }

          robocopy ".\\dist" $env:DEPLOY_PATH /MIR /NFL /NDL /NJH /NJS /NP
          if ($LASTEXITCODE -le 7) {
            exit 0
          }

          exit $LASTEXITCODE
        '''
      }
    }

    stage('Start AppPool') {
      steps {
        powershell '''
          Import-Module WebAdministration
          if (Test-Path "IIS:\\AppPools\\$env:APP_POOL_NAME") {
            Start-WebAppPool -Name $env:APP_POOL_NAME
          }
        '''
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
  }

  post {
    failure {
      powershell '''
        Import-Module WebAdministration
        if (Test-Path "IIS:\\AppPools\\$env:APP_POOL_NAME") {
          Start-WebAppPool -Name $env:APP_POOL_NAME
        }
      '''
    }
  }
}
