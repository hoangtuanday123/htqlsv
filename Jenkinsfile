pipeline {
    agent any
    tools {
        // maven 'maven3.9'
        nodejs 'nodejs23.6'
        // jdk 'jdk17'
       
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/hoangtuanday123/htqlsv.git']])
            }
        }

        stage('build backend') {
            
            steps {
                
                script {
                    sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    cd backend/ && pip install -r requirements.txt && pip install pylint
                    '''
                }
            }
        }
        // stage('Checkstyle Analysis') {
        //     steps{
        //          sh '''
        //          . venv/bin/activate
        //          pylint backend/
        //          '''
        //     }
        // }

        
              
        
        stage('build frontend') {
            steps {
                
                script {
                    sh '''cd frontend/
                    npm install
                    npm run build'''
                
                }
            }
        }
        stage("SonarQube analysis") {
            environment {
                scannerHome=tool 'sonar6.2'
            }
            steps {
              withSonarQubeEnv('sonarserver') {
                sh '''${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=htqlsv-build-ci \
                  -Dsonar.projectName=htqlsv-build-ci \
                  -Dsonar.projectVersion=1.0 \
                  -Dsonar.sources=backend/ \
                  -Dsonar.java.binaries=target/test-classes/com/visualpathit/account/controllerTest/ \
                  -Dsonar.junit.reportsPath=target/surefire-reports/ \
                  -Dsonar.jacoco.reportsPath=target/jacoco.exec \
                  -Dsonar.java.checkstyle.reportPaths=target/checkstyle-result.xml'''
              }
            }
          }

       
        
    }

    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}
