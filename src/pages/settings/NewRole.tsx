import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '@/hooks/api/accessControl';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import neoAxios from '@/lib/neoAxios';

type Permission = {
  id: number;
  permission_name: string;
  group: string;
  created_at: string | null;
  created_by: string | null;
  entity: string;
  action: string;
};

const NewRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [permissionsState, setPermissionsState] = useState<{ [key: string]: { [key: string]: any } }>({});

  // To fetch permissions
  const { data: permissions } = useQuery({
    queryKey: ['getPermissions'],
    queryFn: getPermissions,
  });

  const permissionList = permissions?.data;

  const groupedArray = () => {
    if (!permissionList) return {};

    let result: { [key: string]: { [key: string]: string[] } } = {};

    permissionList.forEach((permission: { group: string; entity: string; action: string; }) => {
      const { group, entity, action } = permission;

      if (!result[group]) {
        result[group] = {};
      }

      if (!result[group][entity]) {
        result[group][entity] = [];
      }

      result[group][entity].push(action);
    });

    return result;
  };

  const groupedPermissions = groupedArray();

  useEffect(() => {
    if (permissions?.data) {
      const initialPermissionsState = permissions.data.reduce((acc: any, perm: any) => {
        if (!acc[perm.group]) acc[perm.group] = {};
        if (!acc[perm.group][perm.entity]) {
          acc[perm.group][perm.entity] = {
            view: false,
            create: false,
            edit: false,
            delete: false,
          };
        }
        return acc;
      }, {});
      setPermissionsState(initialPermissionsState);
    }
  }, [permissions]);

  const handleCheckboxChange = (group: string, entity: string, type: string, value: boolean) => {
    setPermissionsState(prevState => {
      const updatedPermission = { ...prevState[group][entity], [type]: value };

      // If Full Access is checked or unchecked, update all checkboxes
      if (type === 'fullAccess') {
        const newPermissionState = Object.fromEntries(
          Object.keys(updatedPermission).map(key => [key, key === 'fullAccess' ? value : value])
        );
        return { ...prevState, [group]: { ...prevState[group], [entity]: newPermissionState } };
      } else {
        // Update the specific checkbox and determine if Full Access should be checked
        const allChecked = Object.keys(updatedPermission).every(
          key => key === 'fullAccess' || updatedPermission[key]
        );
        updatedPermission['fullAccess'] = allChecked;
        return { ...prevState, [group]: { ...prevState[group], [entity]: updatedPermission } };
      }
    });
  };

  const createRole = async () => {
    const requestBody = {
      name: roleName,
      description: description,
      permissions: permissionsState,
    };
    await neoAxios.post('users/createRole', requestBody);
    navigate('/settings/roles');
  };

  const handleCancel = () => {
    navigate('/settings/roles');
  };

  return (
    <div className="w-full">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 w-half items-center gap-4">
          <Label className="text-right" htmlFor="roleName">
            Role Name
          </Label>
          <Input
            className="col-span-3"
            id="roleName"
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="description">
            Description
          </Label>
          <Textarea
            className="col-span-3"
            id="description"
            placeholder="Max. 100 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {Object.keys(groupedPermissions).map(groupName => (
          <div key={groupName} className="rounded-md border mb-4">
            <h2 className="bg-gray-200 py-2 px-4">{groupName}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  {Object.keys(permissionsState[groupName]?.[Object.keys(permissionsState[groupName])[0]] || {}).map(actionName => (
                    <TableHead key={actionName}>{actionName}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(groupedPermissions[groupName] || {}).map(entityName => (
                  <TableRow key={entityName}>
                    <TableCell>{entityName}</TableCell>
                    {groupedPermissions[groupName][entityName].map(actionName => (
                      <TableCell key={actionName}>
                        <Checkbox
                          checked={permissionsState[groupName]?.[entityName]?.[actionName] || false}
                          onCheckedChange={(value) => handleCheckboxChange(groupName, entityName, actionName, value ? true : false)}
                          aria-label={`Select ${actionName} for ${entityName}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
      <div className="flex justify-left gap-2 p-2">
        <Button onClick={createRole}>Save</Button>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default NewRole;
