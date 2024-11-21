import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import SDLayout from "@/components/SDLayout";

export function UserPage() {
    return (

        <SDLayout>
                <div className="flex flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="flex flex-col justify-center items-center aspect-video rounded-xl bg-muted/50 p-4">
                            <h3 className="font-bold text-lg mb-4">Update Email</h3>
                            <div className="grid w-full max-w-sm items-center gap-2">
                                <Label htmlFor="email">New Email</Label>
                                <Input type="email" placeholder="Email" />
                            </div>
                            <Button variant="outline" className="mt-4">Confirm</Button>
                        </div>

                        <div className="flex flex-col justify-center items-center aspect-video rounded-xl bg-muted/50 p-4">
                            <h3 className="font-bold text-lg mb-4">Update Password</h3>
                            <div className="grid w-full max-w-sm items-center gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input type="password" placeholder="Password" />
                            </div>
                            <Button variant="outline" className="mt-4">Confirm</Button>
                        </div>

                        <div className="flex flex-col justify-between items-center aspect-video rounded-xl bg-muted/50 p-4">
                            <h3 className="font-bold text-lg mb-4">Delete User</h3>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Can a deleted user be recovered?</AccordionTrigger>
                                    <AccordionContent>
                                        Once a user is deleted, recovery depends on whether a backup exists. If no backup is available, the data cannot be recovered.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>What happens to the user's data after deletion?</AccordionTrigger>
                                    <AccordionContent>
                                        The user's data is typically removed from the active database. However, it may remain in backups or logs for compliance or auditing purposes.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Can a user be deleted without admin privileges?</AccordionTrigger>
                                    <AccordionContent>
                                        No, deleting a user generally requires admin privileges to ensure security and prevent unauthorized actions.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant="outline" className="mt-4">Delete User</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <div className="min-h-[100vh] flex justify-center items-center rounded-xl bg-muted/50 md:min-h-min p-4">
                        <h2 className="font-bold text-xl">User Information</h2>
                    </div>
                </div>
        </SDLayout>
    );
}
