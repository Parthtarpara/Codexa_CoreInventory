export const warehouses = [
    {
        id: 'wh_01',
        name: 'Mumbai Hub',
        location: 'Mumbai, Maharashtra',
        capacity: 150000,
        used: 135000,
        status: 'Active',
        zones: ['Zone A (High-Rack)', 'Zone B (Bulk)', 'Zone C (Temp-Controlled)']
    },
    {
        id: 'wh_02',
        name: 'Delhi North',
        location: 'Delhi, NCR',
        capacity: 100000,
        used: 98000,
        status: 'Full',
        zones: ['Zone Alpha', 'Zone Beta (Dangerous Goods)']
    },
    {
        id: 'wh_03',
        name: 'Bangalore Central',
        location: 'Bangalore, Karnataka',
        capacity: 120000,
        used: 45000,
        status: 'Active',
        zones: ['Tech Storage', 'General Assembly']
    },
    {
        id: 'wh_04',
        name: 'Chennai Port',
        location: 'Chennai, Tamil Nadu',
        capacity: 200000,
        used: 110000,
        status: 'Active',
        zones: ['Dock Storage', 'Customs Bonded', 'Export Prep']
    },
    {
        id: 'wh_05',
        name: 'Pune Industrial',
        location: 'Pune, Maharashtra',
        capacity: 80000,
        used: 0,
        status: 'Maintenance',
        zones: ['Facility 1', 'Facility 2']
    }
];
