import { Role } from './role'
import { cambioDiagnostico } from './cambioDiagnostico';
import { StatusUser } from './statusUser';

export interface User {
    id: string
    userName: string
    password: string
    role: Role  
    cambioDiagnosticoList?: cambioDiagnostico[];
    statusUser: StatusUser
}
