import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';
import { Campaign } from '../types'; // Define Campaign type in a separate file if not already done

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Explicit type for the loading state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // Explicit type for campaigns

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
