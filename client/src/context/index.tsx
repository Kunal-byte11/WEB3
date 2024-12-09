import React, { useContext, createContext, ReactNode } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number;
  amountCollected: string;
  image: string;
  pId: number;
}

interface Donation {
  donator: string;
  donation: string;
}

interface StateContextProps {
  address: string | undefined;
  contract: any;
  connect: () => void;
  createCampaign: (form: CampaignForm) => Promise<void>;
  getCampaigns: () => Promise<Campaign[]>;
  getUserCampaigns: () => Promise<Campaign[]>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<Donation[]>;
}

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

interface StateContextProviderProps {
  children: ReactNode;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const { contract } = useContract('0xC6280156d5A6257D03a3159fD1A446De575cCc74');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: CampaignForm) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline
          form.image,
        ],
      });
      console.log('contract call success', data);
    } catch (error) {
      console.log('contract call failure', error);
    }
  };

  const getCampaigns = async (): Promise<Campaign[]> => {
    const campaigns = await contract.call('getCampaigns');
    const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async (): Promise<Campaign[]> => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string) => {
    const data = await contract.call('donateToCampaign', [pId], {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  const getDonations = async (pId: number): Promise<Donation[]> => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations: Donation[] = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};
