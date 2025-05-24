pipeline {
  agent any

  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-fe"
    CONTAINER_NAME = "container-ptsloy"
  }

  options {
    timeout(time: 10, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {

    stage('Deploy to Kubernetes') {
      steps {
        script {
          kubeconfig(credentialsId: 'kubeconfig-prod') {
            sh '''
              echo "✅ Verifying connection to the cluster..."
              kubectl version --client
              kubectl get nodes

              echo "🚀 Updating image to $IMAGE..."
              kubectl set image deployment/$DEPLOYMENT_NAME \
                $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE

              echo "⌛ Waiting for rollout to complete..."
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
      echo '❌ Deployment failed. Investigate logs.'
    }
    always {
      cleanWs()
    }
  }
}
