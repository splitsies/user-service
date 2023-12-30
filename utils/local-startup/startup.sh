sls offline start \
    --host 0.0.0.0 \
    --param='DB_ACCESS_KEY_ID=null' \
    --param='DB_SECRET_ACCESS_KEY=null' \
    --param='DB_REGION=us-west-2' \
    --param='DB_ENDPOINT=http://localhost:9000/' \
    --param='DB_TABLE_NAME=Splitsies-User-local' \
    --param='EXPENSE_API_URL=http://0.0.0.0:14623/dev-pr/expenses/' \
    --param='FIREBASE_DEV_MODE=true'
