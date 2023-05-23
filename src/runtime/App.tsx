import {Layout} from '../theme-default'
import {PageData} from "../shared/types";
import {matchRoutes} from 'react-router-dom';
import {routes} from "island:routes";
import siteData from "island:site-data";

export function App() {
    return <Layout/>
}

/**
 * 初始化页面数据
 * @param routePath
 */
export const initPageData: Promise<PageData> = async (routePath: string) => {
    const matched = matchRoutes(routes, routePath)
    if (matched) {
        const moduleInfo = await matched[0].route.preload();
        return {
            pageType: 'doc',
            siteData,
            frontmatter: moduleInfo.frontmatter,
            pagePath: routePath
        };
    }
    return {
        pageType: '404',
        siteData,
        pagePath: routePath,
        frontmatter: {}
    };
}