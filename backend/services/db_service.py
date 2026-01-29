import boto3
import os
import logging
from botocore.exceptions import ClientError
from decimal import Decimal

logger = logging.getLogger(__name__)

class DynamoDBService:
    _resource = None
    _table = None
    TABLE_NAME = "FinancialTransactions"

    @classmethod
    def get_resource(cls):
        if cls._resource is None:
            cls._resource = boto3.resource(
                'dynamodb',
                region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
        return cls._resource

    @classmethod
    def get_table(cls):
        if cls._table is None:
            cls._table = cls.get_resource().Table(cls.TABLE_NAME)
        return cls._table

    @classmethod
    def init_table(cls):
        """
        Check if table exists, create if not.
        """
        dynamodb = cls.get_resource()
        try:
            table = dynamodb.create_table(
                TableName=cls.TABLE_NAME,
                KeySchema=[
                    {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'id', 'AttributeType': 'N'}
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            )
            print(f"Creating table {cls.TABLE_NAME}...")
            table.wait_until_exists()
            print(f"Table {cls.TABLE_NAME} created successfully.")
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceInUseException':
                print(f"Table {cls.TABLE_NAME} already exists.")
            else:
                logger.error(f"Error creating table: {e}")
                raise

    @classmethod
    def add_transaction(cls, transaction: dict):
        table = cls.get_table()
        # DynamoDB requires Decimal for floats
        item = transaction.copy()
        if isinstance(item.get('amount'), float):
            item['amount'] = Decimal(str(item['amount']))
            
        try:
            table.put_item(Item=item)
            return True
        except ClientError as e:
            logger.error(f"Error adding transaction: {e}")
            return False

    @classmethod
    def get_all_transactions(cls):
        table = cls.get_table()
        try:
            response = table.scan()
            items = response.get('Items', [])
            # Convert Decimal back to float for JSON serialization
            for item in items:
                if isinstance(item.get('amount'), Decimal):
                    item['amount'] = float(item['amount'])
            return items
        except ClientError as e:
            logger.error(f"Error fetching transactions: {e}")
            return []
