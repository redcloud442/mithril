pipeline {
  agent {
    kubernetes {
      inheritFrom 'default'
      yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  serviceAccountName: jenkins-agent
  containers:
  - name: kubectl
    image: alpine/k8s:1.25.4
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
    KUBECONFIG = "/tmp/kubeconfig"
  }

  stages {
    stage('Initialize') {
      steps {
        container('kubectl') {
          sh '''
            echo "📁 Initializing KUBECONFIG"
            kubectl config view --raw > $KUBECONFIG
            chmod 600 $KUBECONFIG
            export KUBECONFIG=$KUBECONFIG
          '''
        }
      }
    }

    stage('Deploy') {
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        container('kubectl') {
          sh '''
            echo "✔️ Shell is working"
            which sh
            export KUBECONFIG=$KUBECONFIG
            kubectl version --client

            echo "✅ Updating deployment image..."
            kubectl set image deployment/${DEPLOYMENT_NAME} \
              ${CONTAINER_NAME}=${IMAGE} -n ${K8S_NAMESPACE} --record

            echo "⏳ Waiting for rollout to complete..."
            kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}


            echo "📦 Listing current pods..."
            kubectl get pods -n ${K8S_NAMESPACE} -o wide
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
    cleanup {
      container('jnlp') {
        cleanWs()
      }
    }
  }
}
