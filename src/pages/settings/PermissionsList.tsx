import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import neoAxios from '@/lib/neoAxios';
import { getPermissions } from '@/hooks/api/accessControl';

import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function UsersList() {
  const [group, setGroup] = useState('');
  const [entity, setEntity] = useState('');
  const [actions, setActions] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user }: any = useFirebaseAuth();

  const { data: permissions, refetch: refetchPermissions} = useQuery({
    queryKey: ['getPermissions'],
    queryFn: getPermissions
  });
  useEffect(() => {
    if (permissions) {
    }
  }, [permissions]);

  const handleSaveClick = async () => {
    const createdBy = user.email;
    const requestBody = {
      group:group,
      entity: entity,
      actions: actions,
      createdBy: createdBy,
    };
    try {
      await neoAxios.post('users/createPermission', requestBody);
      setDialogOpen(false);
      setGroup('');
      setEntity('');
      setActions('');
      refetchPermissions();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Permission</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new permission</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="group">
                  Group
                </Label>
                <Input className="col-span-3" id="group" placeholder="Enter group" value={group} onChange={(e) => setGroup(e.target.value.toUpperCase())} />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="entity">
                  Entity
                </Label>
                <Input className="col-span-3" id="entity" placeholder="Enter entity" value={entity} onChange={(e) => setEntity(e.target.value.toUpperCase())} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="actions">
                  Actions
                </Label>
                <Input className="col-span-3" id="actions" placeholder="Enter an action" value={actions} onChange={(e) => setActions(e.target.value.toUpperCase())} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveClick}
              disabled={actions.trim() === '' || entity.trim()=== '' || group.trim()===""}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Entity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions?.data?.map((permission: any) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.permission_name}</TableCell>
                <TableCell>{permission.group}</TableCell>
                <TableCell>{permission.entity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}