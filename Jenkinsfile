pipeline {
  agent any

  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-fe"
    CONTAINER_NAME = "container-ptsloy"
  }

  stages {
    stage('Deploy to Kubernetes') {
      steps {
        script {
          withKubeConfig([credentialsId: 'kubeconfig-prod']) {
            sh '''
              echo "✅ Using kubeconfig and updating deployment..."
              kubectl set image deployment/$DEPLOYMENT_NAME \
                $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE

              echo "⏳ Waiting for rollout to complete..."
              kubectl rollout status deployment/$DEPLOYMENT_NAME -n $K8S_NAMESPACE
            '''
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deployment succeeded!'
    }
    failure {
      echo '❌ Deployment failed. Check logs.'
    }
    always {
      cleanWs()
    }
  }
}
