pipeline {
  agent any
  environment {
    IMAGE = "ghcr.io/redcloud442/mithril:prod"
  }
  stages {
    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([string(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_CONTENT')]) {
          sh '''
            mkdir -p ~/.kube
            echo "$KUBECONFIG_CONTENT" > ~/.kube/config

            kubectl set image deployment/mithril-deployment \
              mithril-container=$IMAGE -n mithril

            kubectl rollout status deployment/mithril-deployment -n mithril
          '''
        }
      }
    }
  }
}
