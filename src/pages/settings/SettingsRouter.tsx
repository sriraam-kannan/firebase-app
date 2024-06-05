import { Route, Routes } from 'react-router-dom';

import SettingsPage from './SettingsPage';
import UsersList from './UsersList';
import RolesList from './RolesList';
import PermissionsTable from './PermissionsList';
import NewRole from './NewRole';

export default function SettingsRouter(){
    return(
        <Routes>
            <Route path="/" element={<SettingsPage />} />
            <Route path="/users" element={<UsersList/>}/>
            <Route path="/roles" element={<RolesList/>}/>
            <Route path="/roles/newrole" element={<NewRole/>}/>
            <Route path="/permissions" element={<PermissionsTable/>}/>
        </Routes>
    )
}