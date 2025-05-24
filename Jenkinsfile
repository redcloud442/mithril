pipeline {
  agent {
    kubernetes {
      inheritFrom 'default'  // Instead of label
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  serviceAccountName: jenkins-agent  # Updated service account
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['sleep']
    args: ['infinity']
  - name: jnlp
    image: jenkins/inbound-agent:latest
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
    always {
      script {
        node('kubectl-agent') {  // Wrapping cleanWs in a node block
          cleanWs()
        }
      }
    }
    success {
      echo '✅ Deployment succeeded!'
    }
    failure {
      echo '❌ Deployment failed. Check logs.'
    }
  }
}