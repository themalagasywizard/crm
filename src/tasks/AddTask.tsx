import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import {
    AutocompleteInput,
    CreateBase,
    DateInput,
    Form,
    RecordRepresentation,
    ReferenceInput,
    SaveButton,
    SelectInput,
    TextInput,
    Toolbar,
    required,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { contactInputText, contactOptionText } from '../misc/ContactOption';
import { Link } from 'react-router-dom';

export const AddTask = ({
    selectContact,
    display = 'chip',
}: {
    selectContact?: boolean;
    display?: 'chip' | 'icon';
}) => {
    const { identity } = useGetIdentity();
    const { taskTypes } = useConfigurationContext();
    const contact = useRecordContext();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    if (!identity) return null;

    return (
        <>
            {display === 'icon' ? (
                <Tooltip title="Create task">
                    <IconButton
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            ml: 'auto',
                        }}
                        component={Link}
                        to={'#'}
                        onClick={handleOpen}
                    >
                        <ControlPointIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Box mt={2} mb={2}>
                    <Chip
                        icon={<ControlPointIcon />}
                        size="small"
                        variant="outlined"
                        onClick={handleOpen}
                        label="Add task"
                        color="primary"
                    />
                </Box>
            )}

            <CreateBase
                resource="tasks"
                record={{
                    type: 'None',
                    contact_id: contact?.id,
                    due_date: new Date().toISOString().slice(0, 10),
                    sales_id: identity.id,
                }}
                transform={data => {
                    const dueDate = new Date(data.due_date);
                    dueDate.setHours(0, 0, 0, 0);
                    data.due_date = dueDate.toISOString();
                    return {
                        ...data,
                        due_date: new Date(data.due_date).toISOString(),
                    };
                }}
                mutationOptions={{ onSuccess: () => setOpen(false) }}
            >
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    disableRestoreFocus
                    maxWidth="sm"
                >
                    <Form>
                        <DialogCloseButton onClose={() => setOpen(false)} />
                        <DialogTitle id="form-dialog-title">
                            {!selectContact
                                ? 'Create a new task for '
                                : 'Create a new task'}
                            {!selectContact && (
                                <RecordRepresentation
                                    record={contact}
                                    resource="contacts"
                                />
                            )}
                        </DialogTitle>
                        <DialogContent>
                            <Stack gap={2}>
                                <TextInput
                                    autoFocus
                                    source="text"
                                    label="Description"
                                    validate={required()}
                                    multiline
                                    sx={{ margin: 0 }}
                                    helperText={false}
                                />
                                {selectContact && (
                                    <ReferenceInput
                                        source="contact_id"
                                        reference="contacts_summary"
                                    >
                                        <AutocompleteInput
                                            label="Contact"
                                            optionText={contactOptionText}
                                            inputText={contactInputText}
                                            helperText={false}
                                            validate={required()}
                                            TextFieldProps={{
                                                margin: 'none',
                                            }}
                                        />
                                    </ReferenceInput>
                                )}

                                <Stack direction="row" spacing={1}>
                                    <DateInput
                                        source="due_date"
                                        validate={required()}
                                        helperText={false}
                                    />
                                    <SelectInput
                                        source="type"
                                        validate={required()}
                                        choices={taskTypes.map(type => ({
                                            id: type,
                                            name: type,
                                        }))}
                                        helperText={false}
                                    />
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 0 }}>
                            <Toolbar
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <SaveButton onClick={() => setOpen(false)} />
                            </Toolbar>
                        </DialogActions>
                    </Form>
                </Dialog>
            </CreateBase>
        </>
    );
};
