import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

import { Campaign } from '../types'; // Define Campaign type in a separate file or here if not defined elsewhere

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Explicit type for loading state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // Campaign[] for campaigns state

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
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

export default Profile;
