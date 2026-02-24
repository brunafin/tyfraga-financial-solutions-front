type TrustLevel = 'low' | 'medium' | 'high';

export interface ICustomerListItem {
    uuid: string;
    name: string;
    phone: string;
    trust_level: TrustLevel
    bond: string;
    key_pix: string;
}