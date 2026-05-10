using CuidadoraDeCrianca.Data;
using CuidadoraDeCrianca.DTOs;
using CuidadoraDeCrianca.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CuidadoraDeCrianca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetAuthenticatedUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox()
        {
            var userId = GetAuthenticatedUserId();
            if (userId == 0)
                return Unauthorized("Utilizador não autenticado");

            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            var result = messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender!.FullName,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver!.FullName,
                Subject = m.Subject,
                Content = m.Content,
                IsRead = m.IsRead,
                SentAt = m.SentAt
            }).ToList();

            return Ok(result);
        }

        [HttpGet("sent")]
        public async Task<IActionResult> GetSentMessages()
        {
            var userId = GetAuthenticatedUserId();
            if (userId == 0)
                return Unauthorized("Utilizador não autenticado");

            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            var result = messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender!.FullName,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver!.FullName,
                Subject = m.Subject,
                Content = m.Content,
                IsRead = m.IsRead,
                SentAt = m.SentAt
            }).ToList();

            return Ok(result);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto createMessageDto)
        {
            var senderId = GetAuthenticatedUserId();
            if (senderId == 0)
                return Unauthorized("Utilizador não autenticado");

            var receiver = await _context.Users.FindAsync(createMessageDto.ReceiverId);
            if (receiver == null)
                return NotFound("Destinatário não encontrado");

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = createMessageDto.ReceiverId,
                Subject = createMessageDto.Subject,
                Content = createMessageDto.Content
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mensagem enviada com sucesso", messageId = message.Id });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetAuthenticatedUserId();
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
                return NotFound("Mensagem não encontrada");

            if (message.ReceiverId != userId)
                return Forbid("Sem permissão para marcar esta mensagem");

            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();

            return Ok("Mensagem marcada como lida");
        }
    }
}
