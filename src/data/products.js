import { categories } from './categories';
import { warehouses } from './warehouses';

const sampleProducts = [
    ["Proximity Sensor X1", "Electronics", 120, 45, 10, "wh_01", "In Stock"],
    ["Titanium Hex Bolt M8", "Hardware", 0.85, 15000, 2000, "wh_02", "In Stock"],
    ["Polyurethane Resin", "Raw Materials", 45.0, 300, 50, "wh_03", "In Stock"],
    ["Heavy-Duty Cardboard Box", "Packaging", 2.15, 800, 1000, "wh_04", "Low Stock"],
    ["N95 Respirator Mask", "Safety Equipment", 1.5, 450, 500, "wh_01", "Low Stock"],
    ["Lithium-Ion Battery Pack", "Electronics", 85.0, 120, 20, "wh_05", "In Stock"],
    ["Hydraulic Press Seal", "Spare Parts", 12.5, 0, 15, "wh_03", "Out of Stock"],
    ["Torque Wrench Pro", "Tools", 150.0, 45, 5, "wh_01", "In Stock"],
    ["Industrial Solvent X-40", "Chemicals", 35.0, 200, 30, "wh_02", "In Stock"],
    ["LED High Bay Light", "Electronics", 95.0, 85, 10, "wh_04", "In Stock"],

    // 20 more simulated
    ["Stainless Steel Bracket", "Hardware", 4.2, 3500, 500, "wh_01", "In Stock"],
    ["Thermal Paste Tube", "Chemicals", 8.5, 12, 50, "wh_02", "Low Stock"],
    ["Forklift Tire", "Spare Parts", 250.0, 8, 4, "wh_04", "In Stock"],
    ["Safety Goggles Anti-Fog", "Safety Equipment", 15.0, 300, 50, "wh_03", "In Stock"],
    ["Pallet Wrap Roll", "Packaging", 18.0, 45, 20, "wh_01", "In Stock"],
    ["Digital Multimeter", "Tools", 65.0, 32, 10, "wh_02", "In Stock"],
    ["Copper Wire Spool 100m", "Raw Materials", 110.0, 0, 15, "wh_04", "Out of Stock"],
    ["PLC Logic Controller", "Electronics", 450.0, 15, 5, "wh_01", "In Stock"],
    ["Shock Absorber Y-2", "Spare Parts", 85.0, 120, 40, "wh_03", "In Stock"],
    ["Heavy Duty Welding Gloves", "Safety Equipment", 24.0, 85, 30, "wh_01", "In Stock"],

    ["Industrial Adhesive 1L", "Chemicals", 42.0, 65, 20, "wh_02", "In Stock"],
    ["Pneumatic Impact Wrench", "Tools", 185.0, 18, 5, "wh_04", "In Stock"],
    ["Aluminium Extrusion 2m", "Raw Materials", 35.0, 450, 100, "wh_03", "In Stock"],
    ["Barcode Printer Ribbon", "Packaging", 12.0, 0, 25, "wh_01", "Out of Stock"],
    ["High-Temp Bearing", "Spare Parts", 55.0, 230, 50, "wh_02", "In Stock"],
    ["Laser Distance Meter", "Tools", 120.0, 42, 10, "wh_01", "In Stock"],
    ["Synthetic Lubricant 5L", "Chemicals", 85.0, 15, 25, "wh_04", "Low Stock"],
    ["Ear Muffs Pro", "Safety Equipment", 22.0, 150, 40, "wh_03", "In Stock"],
    ["Optical Sensor Array", "Electronics", 320.0, 8, 12, "wh_01", "Low Stock"],
    ["Carbon Fiber Sheet", "Raw Materials", 195.0, 45, 10, "wh_02", "In Stock"],
];

let idCounter = 1;
export const products = sampleProducts.map(p => {
    const [name, catName, price, qty, reorder, whId, status] = p;
    const sku = `SKU-${catName.substring(0, 3).toUpperCase()}-${idCounter.toString().padStart(4, '0')}`;
    idCounter++;

    return {
        id: `prod_${idCounter}`,
        sku: sku,
        name: name,
        category: categories.find(c => c.name === catName)?.id || catName,
        description: `High quality ${name.toLowerCase()} used in industrial applications.`,
        unitPrice: price,
        warehouse: whId,
        quantity: qty,
        reorderPoint: reorder,
        status: status,
        lastUpdated: new Date().toISOString()
    };
});
