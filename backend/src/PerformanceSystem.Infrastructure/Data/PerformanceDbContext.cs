using Microsoft.EntityFrameworkCore;
using PerformanceSystem.Core.Entities;

namespace PerformanceSystem.Infrastructure.Data;

public class PerformanceDbContext : DbContext
{
    public PerformanceDbContext(DbContextOptions<PerformanceDbContext> options)
        : base(options)
    {
    }

    // Users & Roles
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    // Organization
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<Employee> Employees => Set<Employee>();

    // Performance Management
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<Evaluation> Evaluations => Set<Evaluation>();
    public DbSet<EvaluationItem> EvaluationItems => Set<EvaluationItem>();
    public DbSet<Objection> Objections => Set<Objection>();
    public DbSet<PIP> PIPs => Set<PIP>();
    public DbSet<TrainingResult> TrainingResults => Set<TrainingResult>();

    // System
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PerformanceDbContext).Assembly);

        // Configure entity relationships
        ConfigureUserEntities(modelBuilder);
        ConfigureEmployeeEntities(modelBuilder);
        ConfigurePerformanceEntities(modelBuilder);
        ConfigureIndexes(modelBuilder);
    }

    private void ConfigureUserEntities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.EmployeeId);

            entity.HasOne(e => e.Employee)
                .WithOne(e => e.User)
                .HasForeignKey<User>(e => e.EmployeeId);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.RoleName).IsUnique();
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();

            entity.HasOne(e => e.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(e => e.UserId);

            entity.HasOne(e => e.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(e => e.RoleId);
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PermissionName).IsUnique();
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.RoleId, e.PermissionId }).IsUnique();

            entity.HasOne(e => e.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(e => e.RoleId);

            entity.HasOne(e => e.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(e => e.PermissionId);
        });
    }

    private void ConfigureEmployeeEntities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.DepartmentCode).IsUnique();

            entity.HasOne(e => e.ParentDepartment)
                .WithMany(d => d.SubDepartments)
                .HasForeignKey(e => e.ParentDepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Position>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PositionCode).IsUnique();
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.NationalId).IsUnique();
            entity.HasIndex(e => e.EmployeeNumber).IsUnique();
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.DepartmentId);
            entity.HasIndex(e => e.ManagerId);

            entity.HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Position)
                .WithMany(p => p.Employees)
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Manager)
                .WithMany(m => m.Subordinates)
                .HasForeignKey(e => e.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigurePerformanceEntities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId);
            entity.HasIndex(e => e.Status);

            entity.Property(e => e.Weight)
                .HasPrecision(5, 2);

            entity.HasOne(e => e.Employee)
                .WithMany(emp => emp.Goals)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Evaluation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId);
            entity.HasIndex(e => e.Period);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.FinalRating);

            entity.Property(e => e.GoalsScore).HasPrecision(3, 2);
            entity.Property(e => e.BehaviorScore).HasPrecision(3, 2);
            entity.Property(e => e.InitiativesScore).HasPrecision(3, 2);
            entity.Property(e => e.TrainingImpact).HasPrecision(4, 2);
            entity.Property(e => e.FinalScore).HasPrecision(3, 2);

            entity.HasOne(e => e.Employee)
                .WithMany(emp => emp.Evaluations)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EvaluationItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EvaluationId);

            entity.Property(e => e.Weight).HasPrecision(5, 2);
            entity.Property(e => e.Score).HasPrecision(3, 2);

            entity.HasOne(e => e.Evaluation)
                .WithMany(ev => ev.EvaluationItems)
                .HasForeignKey(e => e.EvaluationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Objection>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId);
            entity.HasIndex(e => e.EvaluationId);
            entity.HasIndex(e => e.Status);

            entity.HasOne(e => e.Employee)
                .WithMany(emp => emp.Objections)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Evaluation)
                .WithMany(ev => ev.Objections)
                .HasForeignKey(e => e.EvaluationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PIP>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId);
            entity.HasIndex(e => e.Status);

            entity.HasOne(e => e.Employee)
                .WithMany(emp => emp.PIPs)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TrainingResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId);

            entity.Property(e => e.ScorePercent).HasPrecision(5, 2);
            entity.Property(e => e.Impact).HasPrecision(4, 2);

            entity.HasOne(e => e.Employee)
                .WithMany(emp => emp.TrainingResults)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private void ConfigureIndexes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Action);
            entity.HasIndex(e => e.Entity);
            entity.HasIndex(e => e.CreatedAt);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.IsRead);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
