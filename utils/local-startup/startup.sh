FIREBASE_USER_EMULATOR_HOST=http://127.0.0.1:9099
sls offline start \
    --host 0.0.0.0 \
    --param='QUEUE_STAGE_NAME=local' \
    --param='DB_ACCESS_KEY_ID=null' \
    --param='DB_SECRET_ACCESS_KEY=null' \
    --param='DB_REGION=us-west-2' \
    --param='DB_ENDPOINT=http://localhost:8000/' \
    --param='DB_TABLE_NAME=Splitsies-User-local' \
    --param='FIREBASE_DEV_MODE=true' \
    --param='MESSAGE_QUEUE_RESOURCE_NAME=Splitsies-MessageQueue-local' \
    --param="FIREBASE_ADMIN_CREDS=$FIREBASE_ADMIN_CREDS"

