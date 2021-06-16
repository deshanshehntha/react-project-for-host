
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/TableList.js";
import Maps from "views/Maps.js";
import Upgrade from "views/Upgrade.js";
import UserPage from "views/UserPage.js";
import ReportFormats from "./views/ReportFormats";
import CreateMedicalReport from "./views/CreateMedicalReport"
import ViewMedicalReports from "./views/ViewMedicalReports"

var dashRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "design_app",
        component: Dashboard,
        layout: "/admin",
    },
    {
        path: "/notifications",
        name: "Notifications",
        icon: "ui-1_bell-53",
        component: Notifications,
        layout: "/admin",
    },
    {
        path: "/viewReports",
        name: "Medical Reports",
        icon: "design-2_ruler-pencil",
        component: ViewMedicalReports,
        layout: "/admin",
    },
    {
        path: "/viewReportFormat",
        name: "Report Formats",
        icon: "design-2_ruler-pencil",
        component: ReportFormats,
        layout: "/admin",
    },
    {
        path: "/createMedicalReport",
        name: "Medical Report",
        icon: "design-2_ruler-pencil",
        component: CreateMedicalReport,
        layout: "/admin",
    }
];
export default dashRoutes;
