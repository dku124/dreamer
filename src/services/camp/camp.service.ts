import {User} from "@/@types/user.type";
import AxiosClient from "@/common/providers/AxiosClient";
import {Camp} from "@/@types/camp/camp.type.ts";
import {Ad} from "@/@types/camp/ad.type.ts";

const END_POINT = "/camp"
const CampService = {
	getPage:async (query:Query|undefined) => {
		return await AxiosClient.get<User,Page<Camp>>(`${END_POINT}/getPageCamp`,{
			params:query
		});
	},
	updateCamp:async (camp:Partial<Camp>) => {
		return await AxiosClient.put<User,Camp>(`${END_POINT}/camp/${camp._id}`,{
			"typeCamp":camp.typeCamp,
			"priceAllow": camp.priceAllow
		});
	},
	updateAd:async (ad:Ad,query:Record<string, string>) => {
		return await AxiosClient.put<User,Ad>(`${END_POINT}/ads/`,{
			"campaign_name": ad.campaign_name,
			"cpm": ad.cpm,
			"adsSpend": ad.adsSpend,
			"clicks": ad.clicks,
			"cpc": ad.cpc
		},{
			params:query
		});
	},
	createCamp: async(camp:Partial<Camp>)=>{
		return AxiosClient.post<Camp,Camp>(`${END_POINT}`,camp)
	},
	createAd: async (ad:Partial<Ad>)=>{
		return AxiosClient.post<Ad,Ad>(`${END_POINT}/ad`,ad)
	}
}
export default CampService;