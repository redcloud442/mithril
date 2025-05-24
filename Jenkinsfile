pipeline {
  agent any
  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-deployment"
    CONTAINER_NAME = "mithril-container"
  }

  options {
    timeout(time: 10, unit: 'MINUTES') // Prevent hanging builds
    disableConcurrentBuilds() // Prevent overlapping deploys
  }

  stages {

    stage('Verify KubeConfig') {
      steps {
        withCredentials([string(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_CONTENT')]) {
          sh '''
            mkdir -p ~/.kube
            echo "$KUBECONFIG_CONTENT" > ~/.kube/config
            kubectl version --client
            kubectl get nodes
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([string(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_CONTENT')]) {
          sh '''
            mkdir -p ~/.kube
            echo "$KUBECONFIG_CONTENT" > ~/.kube/config

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
      cleanWs() // optional: clean workspace
    }
  }
}
