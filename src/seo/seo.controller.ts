import {Controller, Get, Res, Header} from '@nestjs/common';
import  type {Response} from 'express';
import {SeoService} from "./seo.service"

@Controller()//se deja vacio para que se pegue a la raiz de olavarriaconecta.com
export class SeoController {
    constructor (private readonly seoService:SeoService){}

    @Get('sitemap.xml')
    @Header ('Content-Type', 'application/xml')

    async getSitemap(@Res() res:Response){
        const sitemapXml = await this.seoService.generateSitemap();
        return res.status(200).send(sitemapXml);
    }
}