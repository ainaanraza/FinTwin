class DataPrepService:
    @staticmethod
    def clean_data(raw_data: list) -> list:
        """
        Simulates data cleaning using IBM Watsonx Data Prep Kit.
        Normalizes merchant names (e.g., 'UBER *TRIP' -> 'Uber').
        """
        cleaned_data = []
        for item in raw_data:
            new_item = item.copy()
            # Mock normalization logic
            merchant = item.get('merchant', '').lower()
            if 'uber' in merchant:
                new_item['merchant'] = 'Uber'
                new_item['category'] = 'Transport'
            elif 'whole foods' in merchant or 'burger' in merchant:
                new_item['category'] = 'Food'
            elif 'amazon' in merchant:
                new_item['category'] = 'Shopping'
                
            cleaned_data.append(new_item)
            
        return cleaned_data
