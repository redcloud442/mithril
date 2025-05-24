pipeline {
  agent {
    kubernetes {
      inheritFrom 'default'  // Uses predefined pod template
      yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  serviceAccountName: jenkins-agent  # Pre-configured SA with permissions
  containers:
  - name: kubectl
    image: alpine/k8s:1.25.4  # Lightweight kubectl image
    command: ['sleep']
    args: ['infinity']
  - name: jnlp
    image: jenkins/inbound-agent:latest
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
'''
    }
  }

  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
    K8S_NAMESPACE = "mithril"
    DEPLOYMENT_NAME = "mithril-fe"
    CONTAINER_NAME = "container-ptsloy"
    KUBECONFIG = "/tmp/kubeconfig"  # Cached config location
  }

  stages {
    stage('Initialize') {
      steps {
        container('kubectl') {
          sh '''
            # Cache kubeconfig for faster subsequent calls
            kubectl config view --raw > $KUBECONFIG
            chmod 600 $KUBECONFIG
          '''
        }
      }
    }

    stage('Deploy') {
      options {
        timeout(time: 10, unit: 'MINUTES')  # Fail if stage exceeds 10 mins
      }
      steps {
        container('kubectl') {
          sh '''
            # Set image with timeout
            kubectl set image deployment/$DEPLOYMENT_NAME \
              $CONTAINER_NAME=$IMAGE -n $K8S_NAMESPACE \
              --request-timeout=30s

            # Monitor rollout with progress checks
            kubectl rollout status deployment/$DEPLOYMENT_NAME \
              -n $K8S_NAMESPACE \
              --timeout=300s
          '''
        }
      }
    }

    stage('Verify Health') {
      steps {
        retry(3) {  // Auto-retry up to 3 times
          timeout(time: 2, unit: 'MINUTES') {
            container('kubectl') {
              sh '''
                # Fast health check with retry logic
                curl -fsS --max-time 30 --retry 3 --retry-delay 5 \
                  http://${DEPLOYMENT_NAME}.${K8S_NAMESPACE}.svc.cluster.local/health
              '''
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deployment succeeded!'
      slackSend(color: 'good', message: "Deployed ${DEPLOYMENT_NAME} successfully")
    }
    failure {
      echo '❌ Deployment failed. Check logs.'
      slackSend(color: 'danger', message: "Failed deploying ${DEPLOYMENT_NAME}")
    }
    cleanup {
      container('jnlp') {
        cleanWs()  // Workspace cleanup
      }
    }
  }
}