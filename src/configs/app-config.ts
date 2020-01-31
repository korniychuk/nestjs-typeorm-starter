export class EnvConfig {
  @IsNotEmpty()
  public POSTGRES_DB!: string;
  public POSTGRES_HOST: string = 'localhost';
  public POSTGRES_LOGGING: boolean = false;
  public POSTGRES_PASS!: string;
  public POSTGRES_PORT: number = 5432;
  public POSTGRES_SUPER_PASS!: string;
  public POSTGRES_USER!: string;
}
