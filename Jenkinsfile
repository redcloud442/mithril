pipeline {
  agent any

  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-fe"
    CONTAINER_NAME = "container-ptsloy"
  }

  stages {
    stage('Verify Tools') {
      steps {
        script {
          try {
            sh 'which kubectl || { echo "kubectl not found"; exit 1; }'
          } catch (Exception e) {
            error("❌ kubectl is not installed on this agent. Please use an agent with kubectl installed.")
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          echo "✅ Using default kubeconfig and updating deployment..."
          kubectl set image deployment/$DEPLOYMENT_NAME \
            $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE

          echo "⏳ Waiting for rollout to complete..."
          kubectl rollout status deployment/$DEPLOYMENT_NAME -n $K8S_NAMESPACE
        '''
      }
    }

    stage('Exchange') {
      steps {
        echo "🔁 Verifying deployment exchange/health..."
        sh '''
          # Example health check (adjust the URL as needed)
          curl --fail http://mithril-fe.mithril.svc.cluster.local/health || exit 1
        '''
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