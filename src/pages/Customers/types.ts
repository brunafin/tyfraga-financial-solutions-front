export type TrustLevel = 'low' | 'medium' | 'high';
export type TrustLevelUi = 'baixo' | 'médio' | 'alto';

export interface ICustomerListItem {
    uuid: string;
    name: string;
    phone: string;
    loansCount: number;
    status: boolean;
}