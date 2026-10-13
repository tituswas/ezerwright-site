import site from '../src/config/production.json' with {type:'json'};
export const productionSettings={origin:site.origin,mode:site.mode,services:[...site.services.map(service=>service.id),'other']};
