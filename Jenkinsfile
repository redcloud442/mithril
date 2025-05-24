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

    stage('Verify KubeConfig') {
      steps {
        withKubeConfig([credentialsId: 'kubeconfig-prod']) {
          sh '''
            kubectl version --client
            kubectl get nodes
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withKubeConfig([credentialsId: 'kubeconfig-prod']) {
          sh '''
            echo "Updating image to $IMAGE..."
            kubectl set image deployment/$DEPLOYMENT_NAME \
              $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE

            echo "Waiting for rollout to complete..."
            kubectl rollout status deployment/$DEPLOYMENT_NAME -n $K8S_NAMESPACE
          '''
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
