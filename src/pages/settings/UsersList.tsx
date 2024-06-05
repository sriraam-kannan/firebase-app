import { useQuery } from '@tanstack/react-query';
import { getUsers, getRoles } from '@/hooks/api/accessControl';
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import neoAxios from '@/lib/neoAxios';

export default function UsersList() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: users, refetch: refetchUsers} = useQuery({
    queryKey: ['getUser'],
    queryFn: getUsers
  });

  const { data: roles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: getRoles
  });

  useEffect(() => {
    if (roles) {
    }
  }, [roles]);

  const handleSaveClick = async () => {
    const selectedRole = roles?.data?.find((r:any) => r.name === role);
    const roleId = selectedRole ? selectedRole.id : '';
    const requestBody = {
      name: name,
      email_id: email,
      role: role,
      role_id: roleId
    };
    try {
      await neoAxios.post('users/createUser', requestBody);
      setDialogOpen(false);
      setName('');
      setEmail('');       
      setRole('');
      refetchUsers();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Fill out the form to create a new user.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="name">
                  Name
                </Label>
                <Input className="col-span-3" id="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="email">
                  Email
                </Label>
                <Input className="col-span-3" id="email" placeholder="example@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="role">
                  Role
                </Label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-auto">
                    {Array.isArray(roles?.data) && roles.data.map((role:any) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveClick}
              disabled={email.trim() === ''}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email_id}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}