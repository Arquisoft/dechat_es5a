import { TTLWriterUtil } from './ttlWriterUtil';
describe('TLL Writer Utils', ()=>{
    const ttlwriter: TTLWriterUtil = new TTLWriterUtil();
    
    it('should write prefix', ()=>{
        expect(ttlwriter.writePrefix('name', 'url')).toContain('@prefix');
    });
    it('should write name', ()=>{
        expect(ttlwriter.writeName('aName')).toContain('aName');
    });
    it('should write string property', ()=>{
        expect(ttlwriter.writeStringProperty('ont', 'content','text')).toContain('text');
    });
    it('should write object property', ()=>{
        expect(ttlwriter.writeObjectProperty('ont', 'content','text')).toContain('text');
    });
});