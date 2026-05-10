export type TrustLevel = 'low' | 'medium' | 'high';
export type TrustLevelUi = 'baixo' | 'médio' | 'alto';

export interface ICustomerListItem {
    id: number;
    uuid: string;
    name: string;
    phone: string;
    loansCount: number;
    averageTax: number;
    status: boolean;
}