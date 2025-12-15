export default () => ({
  port: parseInt(process.env.PORT || '3004', 10),
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  integrationsService: {
    url:
      process.env.INTEGRATIONS_SERVICE_URL ||
      'http://integrations-service:3003',
  },
  notificationService: {
    url:
      process.env.NOTIFICATION_SERVICE_URL ||
      'http://notification-service:3005',
    reportEmail:
      process.env.NOTIFICATION_REPORT_EMAIL || 'notificacoes@exemplo.com',
    operationsEmail:
      process.env.NOTIFICATION_OPERATIONS_EMAIL || 'operacoes@exemplo.com',
  },
  fileStorage: {
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  batch: {
    maxItems: parseInt(process.env.MAX_BATCH_ITEMS || '10000', 10),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
});
