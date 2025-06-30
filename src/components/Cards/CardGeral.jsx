import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const CardGeral = ({
  filtro,
  card = [],
  ClassNameCard,
  ClassTitulo,
  Desc,
  showButtons = false,
  customButton,
  onCardClick,
}) => {
  const [layout, setLayout] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) setLayout('mobile');
      else if (width < 992) setLayout('split');
      else setLayout('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para formatar valores em reais
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para corrigir textos comuns
  const corrigirTexto = (texto) => {
    if (!texto) return '';

    return texto
      .replace(/unitéis/g, 'unidades')
      .replace(/Velor/g, 'Valor')
      .replace(/Palitro/g, 'Palito');
  };

  // SOLUÇÃO FINAL PARA AS IMAGENS - Versão simplificada e robusta
  const getImagemSrc = (item) => {
    if (!item?.imagem_url) {
      return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
    }

    // Se já é uma URL completa (http/https)
    if (/^https?:\/\//i.test(item.imagem_url)) {
      return item.imagem_url;
    }

    // Se é um caminho local
    if (item.imagem_url.startsWith('/uploads/')) {
      return `http://localhost:3000${item.imagem_url}`;
    }

    // Padrão final - considera como caminho relativo
    return `http://localhost:3000/uploads/${item.imagem_url}`;
  };

  return (
    <div className={ClassNameCard} style={{ width: '100%' }}>
      {filtro && <h2>{filtro}</h2>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '10px' }}>
        {card.map((item, index) => {
          const isDisabled = item.estoqueInsuficiente;
          const imgSrc = getImagemSrc(item);
          console.log(`URL da imagem para ${item.nome}:`, imgSrc);

          return (
            <div
              key={item.id || index}
              style={{
                width: layout === 'desktop' ? 'calc(50% - 0.5rem)' : '100%',
                minWidth: '300px',
              }}
            >
              <Card
                className={`shadow rounded d-flex ${layout === 'mobile' ? 'flex-column' : 'flex-row'}`}
                style={{
                  minHeight: '200px',
                  height: '100%',
                  cursor: onCardClick ? 'pointer' : 'default',
                }}
                onClick={() => onCardClick?.(item.id)}
              >
                <Card.Img
                  src={imgSrc}
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', e.target.src);
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                  }}
                  className="rounded"
                  style={{
                    width: layout === 'mobile' ? '100%' : '200px',
                    height: layout === 'mobile' ? '200px' : '150px',
                    objectFit: 'cover',
                    borderRadius: layout === 'mobile' ? '20px 20px 0 0' : '0 0 0 20px',
                    flexShrink: 0,
                  }}
                  variant="top"
                  alt={item.nome || 'Imagem do produto'}
                />

                <Card.Body style={{ flex: 1 }}>
                  <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>

                  {Array.isArray(item.descricao) &&
                    item.descricao.map((desc, i) => {
                      const textoCorrigido = corrigirTexto(desc.texto);
                      const isVencimento = textoCorrigido?.toLowerCase().includes('vencimento');
                      const isQuantidade = textoCorrigido?.toLowerCase().includes('quantidade');
                      const isValor = textoCorrigido?.toLowerCase().includes('valor');
                      const isDanger = desc.badge === 'danger';

                      const aplicarFundo = isDanger && (isVencimento || isQuantidade);

                      // SOLUÇÃO: Usar o valor real do item em vez de extrair do texto
                      let conteudoFormatado = textoCorrigido;

                      if (isValor && item.valor_insumos) {
                        // Converter o valor para número e formatar corretamente
                        const valorNumerico = parseFloat(item.valor_insumos);
                        if (!isNaN(valorNumerico)) {
                          conteudoFormatado = `Valor unitário: ${formatarValor(valorNumerico)}`;
                        }
                      }

                      return (
                        <Card.Text
                          key={i}
                          className={Desc}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: aplicarFundo ? '#f5c6cb' : 'transparent',
                            color: aplicarFundo ? '#8a1c1c' : 'inherit',
                            borderRadius: aplicarFundo ? '6px' : '0',
                            padding: aplicarFundo ? '6px 10px' : '0',
                            ...(desc.style || {}),
                          }}
                          title={desc.tooltip || ''}
                        >
                          <span>
                            {isQuantidade
                              ? (() => {
                                const match = textoCorrigido.match(/quantidade:\s*([\d.,]+)\s*(\w+)?/i);
                                const valor = match?.[1] ? parseFloat(match[1].replace(',', '.')) : null;
                                const unidade = match?.[2] || ''; // Se existir, mostra

                                return valor !== null
                                  ? `Quantidade: ${valor.toLocaleString('pt-BR', {
                                    minimumFractionDigits: valor % 1 === 0 ? 0 : 2,
                                    maximumFractionDigits: 3,
                                  })} ${unidade}`
                                  : textoCorrigido;
                              })()
                              : conteudoFormatado}
                          </span>
                          {desc.badge && (
                            <span
                              style={{
                                backgroundColor: '#8a1c1c',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '2px 8px',
                                fontSize: '0.8rem',
                                marginLeft: '8px',
                              }}
                            >
                              Vencendo
                            </span>
                          )}
                        </Card.Text>
                      );
                    })}

                  {/* BLOCO CENTRALIZADO DE ESTOQUE INSUFICIENTE */}
                  {isDisabled && (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center mt-3"
                    >
                      <div
                        style={{
                          backgroundColor: '#e74c3c',
                          color: '#fff',
                          fontWeight: 'bold',
                          padding: '10px 20px',
                          borderRadius: '30px',
                          marginBottom: '10px',
                          fontSize: '1rem',
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        Estoque insuficiente
                      </div>
                      <Button
                        variant="outline-danger"
                        className="rounded-pill px-4 py-2"
                        style={{ fontWeight: 'bold' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = '/estoque';
                        }}
                      >
                        Ver Estoque
                      </Button>
                    </div>
                  )}

                  {/* BOTÕES DE EDIÇÃO/EXCLUSÃO */}
                  {!isDisabled && (customButton ? (
                    customButton(item)
                  ) : showButtons ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        variant="warning"
                        className="rounded-circle fs-5 text-center shadow m-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.acoes?.[0]?.onClick?.();
                        }}
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        variant="danger"
                        className="rounded-circle fs-5 text-center shadow m-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.acoes?.[1]?.onClick?.();
                        }}
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </div>
                  ) : null)}
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardGeral;