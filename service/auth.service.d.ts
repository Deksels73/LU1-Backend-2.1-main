export declare const AuthService: {
    register(name: string, password: string, code: string): Promise<{
        error: string;
        status: number;
        success?: never;
        role?: never;
    } | {
        success: boolean;
        role: string;
        error?: never;
        status?: never;
    }>;
    login(name: string, password: string): Promise<{
        error: string;
        status: number;
        success?: never;
        role?: never;
        id?: never;
        name?: never;
    } | {
        success: boolean;
        role: string;
        id: number;
        name: string;
        error?: never;
        status?: never;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map