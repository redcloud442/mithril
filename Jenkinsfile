pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: default
  containers:
    - name: kubectl
      image: lachlanevenson/k8s-kubectl:v1.25.4
      command:
        - cat
      tty: true
"""
    }
  }

  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-fe"
    CONTAINER_NAME = "container-ptsloy"
  }

  stages {
    stage('Verify Tools') {
      steps {
        container('kubectl') {
          sh '''
            echo "✅ Checking if kubectl is available..."
            kubectl version --client
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        container('kubectl') {
          sh '''
            echo "✅ Updating deployment..."
            kubectl set image deployment/$DEPLOYMENT_NAME \
              $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE

            echo "⏳ Waiting for rollout to complete..."
            kubectl rollout status deployment/$DEPLOYMENT_NAME -n $K8S_NAMESPACE
          '''
        }
      }
    }

    stage('Exchange') {
      steps {
        container('kubectl') {
          echo "🔁 Verifying deployment health..."
          sh '''
            curl --fail http://mithril-fe.mithril.svc.cluster.local/health || exit 1
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
      echo '❌ Deployment failed. Check logs.'
    }
    always {
      cleanWs()
    }
  }
}
