import { useQuery } from '@tanstack/react-query';
import { getRoles } from '@/hooks/api/accessControl';
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

export default function RolesList() {

  const navigate = useNavigate();
  const { data: roles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: getRoles
  });
  useEffect(() => {
    if (roles) {
    }
  }, [roles]);

  function handleNewRole(){
    navigate('/settings/roles/newrole');
  }
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
            <Button onClick={handleNewRole}>Create Roles</Button>
      </div>
      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.data?.map((roles: any) => (
              <TableRow key={roles.id}>
                <TableCell>{roles.name}</TableCell>
                <TableCell>{roles.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}