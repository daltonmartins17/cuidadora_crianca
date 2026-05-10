using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using CuidadoraDeCrianca.Data;
using CuidadoraDeCrianca.Services;
using CuidadoraDeCrianca.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Services
builder.Services.AddScoped<AuthService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ensure upload folder exists and apply migrations
var uploadsPath = Path.Combine(builder.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsPath);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Seed data
    if (!db.Users.Any())
    {
        // Create parent user
        var parentUser = new CuidadoraDeCrianca.Models.User
        {
            Email = "pai@exemplo.com",
            FullName = "João Silva",
            UserType = "Parent",
            PhoneNumber = "912345678",
            IsActive = true
        };
        parentUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123");
        db.Users.Add(parentUser);

        // Create babysitter user
        var babysitterUser = new CuidadoraDeCrianca.Models.User
        {
            Email = "cuidadora@exemplo.com",
            FullName = "Maria Santos",
            UserType = "BabySitter",
            PhoneNumber = "987654321",
            IsActive = true
        };
        babysitterUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123");
        db.Users.Add(babysitterUser);

        db.SaveChanges();

        // Create profiles
        var parentProfile = new CuidadoraDeCrianca.Models.Profile
        {
            UserId = parentUser.Id,
            Location = "Lisboa, Portugal",
            City = "Lisboa",
            District = "Lisboa",
            Bio = "Pai de dois filhos procurando babá confiável.",
            IsAvailable = false // Parents don't need availability
        };
        db.Profiles.Add(parentProfile);

        var babysitterProfile = new CuidadoraDeCrianca.Models.Profile
        {
            UserId = babysitterUser.Id,
            Location = "Lisboa, Portugal",
            City = "Lisboa",
            District = "Lisboa",
            PricePerHour = 15.00m,
            Bio = "Babá experiente com 5 anos de experiência cuidando de crianças de todas as idades.",
            Experience = "5 anos de experiência",
            Certifications = "Primeiros Socorros, RCP",
            IsAvailable = true,
            Specializations = "Cuidado infantil, atividades educativas"
        };
        db.Profiles.Add(babysitterProfile);

        db.SaveChanges();
    }
}

app.Run();