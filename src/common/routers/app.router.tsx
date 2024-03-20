import {Navigate, useLocation, useRoutes} from "react-router";
import {AuthLayout} from "../layouts/auth.layout";
import {DefaultLayout} from "../layouts/default.layout";
import {LazyLoad} from '@/common/utils/method.utils';
import {useSelector} from "react-redux";
import {authSelector} from "../store/auth/auth.slice";
import {UserRole} from "@/@types/user.type";
import {RouteObjectWithRoles} from '@/@types/custom.type';

const DEFAULT_PATH = '/dashboard';
const NotFoundPage = LazyLoad(() => import('@pages/noLogin/notFound/NotFound.tsx'))
const LoginPage = LazyLoad(() => import('@pages/noLogin/login/Login.tsx'))
const UserPage = LazyLoad(() => import('@pages/login/user/UserManager.tsx'))
const SupplierPage = LazyLoad(() => import('@pages/login/repo/supplier/SupplierManager.tsx'))
const ProductUnitPage = LazyLoad(() => import('@pages/login/repo/product-unit/ProductUnitManager.tsx'))
const CategoryPage = LazyLoad(() => import('@pages/login/repo/category/CategoryManager.tsx'))
const CustomerPage = LazyLoad(() => import('@pages/login/repo/customer/customerManager.tsx'))
const ProductPage = LazyLoad(() => import('@pages/login/repo/product/ProductManager.tsx'))
const OrderPage = LazyLoad(() => import('@pages/login/order/OrderManager.tsx'))
const ShipPage = LazyLoad(() => import('@pages/login/ship/ShipManager.tsx'))
const SettingPage = LazyLoad(() => import('@pages/login/setting/Setting.tsx'))
const CampaignPage = LazyLoad(() => import('@pages/login/camp/CampManager.tsx'))
const OverviewAnalysis = LazyLoad(() => import('@pages/login/analysis/overview/overview.analysis.tsx'))
const OrderAnalysis = LazyLoad(() => import('@pages/login/analysis/order/order.analysis.tsx'))
const ShipAnalysis = LazyLoad(() => import('@pages/login/analysis/ship/ship.analysis.tsx'))
const RepoAnalysis = LazyLoad(() => import('@pages/login/analysis/repo/repo.analysis.tsx'))
const CampaignAnalysis = LazyLoad(() => import('@pages/login/analysis/campaign/camp.analysis.tsx'))
const CustomerAnalysis = LazyLoad(() => import('@pages/login/analysis/customer/customer.analysis.tsx'))
const AppRouter = () => {
	const auth = useSelector(authSelector)
	const isLogin = auth.token !== '';
	const locationPath = useLocation();
	const firstPathByRole = (role:UserRole[]) => {
		switch (role[0]) {
			case UserRole.ADMIN:
				return '/dashboard/quanlyuser';
			case UserRole.TELE_SALE:
				return '/dashboard/quanlydon';
			case UserRole.WAREHOUSE:
				return '/dashboard/quanlykho/quanlynhacungcap';
			case UserRole.DELIVERY:
				return '/dashboard/vandon';
			case UserRole.LEADER:
				return '/dashboard/quanlydon';
			default:
				return '/404';
		}
	}






    const routes:RouteObjectWithRoles[] = [
        {
            path: "/",
            element: !isLogin ? <AuthLayout /> : <Navigate to={DEFAULT_PATH} replace />,
            children:[
                {
                    path: "/",
                    element: <LoginPage />
                },
            ],
			
        },
        {
            path: "/dashboard",
            element: isLogin ? <DefaultLayout /> : <Navigate to="/" replace />,
            children:[
				{
					path: "/dashboard",
					element: <Navigate to={firstPathByRole(auth.roles)} replace />
				},
				{
					path: "/dashboard/quanlyuser",
					element: <UserPage />
					
				},
				{
					path: "/dashboard/quanlykhachhang",
					element: <CustomerPage />
				},
				{
					path: "/dashboard/quanlykho",
					children:[
						
						{
							path: "/dashboard/quanlykho/quanlynhacungcap",
							element: <SupplierPage />
						},
						{
							path: "/dashboard/quanlykho/quanlydonvikho",
							element: <ProductUnitPage />
						},
						{
							path: "/dashboard/quanlykho/quanlydanhmuc",
							element: <CategoryPage />
						},
						{
							path: "/dashboard/quanlykho/quanlysanpham",
							element: <ProductPage />
						},
					]
				},
				{
					path: "/dashboard/thongke",
					children:[
						{
							path: "/dashboard/thongke/tongquan",
							element: <OverviewAnalysis />
						},
						{
							path: "/dashboard/thongke/donhang",
							element: <OrderAnalysis />
						},
						{
							path: "/dashboard/thongke/giaohang",
							element: <ShipAnalysis />
						},
						{
							path: "/dashboard/thongke/kho",
							element: <RepoAnalysis />
						},
						{
							path: "/dashboard/thongke/quangcao",
							element: <CampaignAnalysis />
						},
						{
							path: "/dashboard/thongke/khachhang",
							element: <CustomerAnalysis />
						},
						
					]
				},
				{
					path: "/dashboard/quanlydon",
					element: <OrderPage />
				},
				{
					path: "/dashboard/vandon",
					element: <ShipPage />
				},
				{
					path: "/dashboard/setting",
					element: <SettingPage />
				},
				{
					path: "/dashboard/campaign",
					element: <CampaignPage />
				},
				
				
            ],
		
        },
        {
            path: "/404",
            element: <NotFoundPage />
        },
        {
            path: "*",
            element: <Navigate to="/404" replace />
        }
    ]
    return useRoutes(routes);
}
export default AppRouter;
