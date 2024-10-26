import React from 'react';
import './VisualAbstract.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransformerDiagram = () => (
  <div className="diagram">
    <div className="encoder-stack">
      <div className="layer">Multi-Head Self-Attention</div>
      <div className="layer">Feed Forward Network</div>
    </div>
    <div className="decoder-stack">
      <div className="layer">Multi-Head Self-Attention</div>
      <div className="layer">Multi-Head Attention</div>
      <div className="layer">Feed Forward Network</div>
    </div>
  </div>
);

const VisualAbstract = () => {
  const chartData = {
    labels: ['Transformer (big)', 'Previous SOTA'],
    datasets: [
      {
        label: 'BLEU Score (EN-DE)',
        data: [28.4, 26.3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'BLEU Score (EN-FR)',
        data: [41.8, 41.29],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
  };

  return (
    <div className="visual-abstract">
      <h1 className="title">Attention Is All You Need</h1>

      <div className="main-content">
        <div className="left-column">
          <div className="section overview">
            <h2>Overview</h2>
            <div className="subsection problem">
              <h3>Problem</h3>
              <p>{problem}</p>
            </div>
            <div className="subsection solution">
              <h3>Solution</h3>
              <p>{solution}</p>
            </div>
            <div className="subsection hypothesis">
              <h3>Hypothesis</h3>
              <p>{hypothesis}</p>
            </div>
          </div>

          <div className="section context">
            <h2>Context</h2>
            <p>{background}</p>
          </div>
        </div>

        <div className="center-column">
          <div className="section methodologies">
            <h2>Methodologies</h2>
            <div className="transformer-diagram">
              <TransformerDiagram />
              <p className="caption">{transformerCaption}</p>
            </div>
            <div className="subsection multi-head-attention">
              <h3>Multi-Head Attention</h3>
              <p>{multiHeadAttention}</p>
            </div>
            <div className="subsection positional-encoding">
              <h3>Positional Encoding</h3>
              <p>{positionalEncoding}</p>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="section results">
            <h2>Results</h2>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
              <p className="caption">{chartCaption}</p>
            </div>
            <div className="subsection training-efficiency">
              <h3>Training Efficiency</h3>
              <p>{trainingEfficiency}</p>
            </div>
            <div className="subsection generalization">
              <h3>Generalization</h3>
              <p>{generalization}</p>
            </div>
          </div>

          <div className="section conclusion">
            <h2>Conclusion</h2>
            <div className="subsection summary">
              <h3>Summary</h3>
              <p>{summary}</p>
            </div>
            <div className="subsection future-work">
              <h3>Future Work</h3>
              <p>{futureWork}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAbstract;

const problem = "- Sequence transduction models rely on recurrent neural networks (RNNs) like LSTMs and GRUs.\n- RNNs process information sequentially, limiting parallelization and posing challenges for long sequences.";
const solution = "- Introducing the Transformer, a novel network architecture based solely on attention mechanisms.\n- The Transformer eliminates recurrence and relies on parallelizable attention for global dependency modeling.";
const hypothesis = "- An attention-based model can outperform RNN-based models in sequence transduction tasks.\n- Attention allows for better parallelization and efficient handling of long-range dependencies.";
const background = "- Sequence transduction models are crucial for tasks like language translation and text summarization.\n- Traditional models rely heavily on RNNs, hindering computational speed and efficiency.\n- Attention mechanisms have shown promise in capturing long-range dependencies in sequences.";
const multiHeadAttention = "- Allows the model to focus on different parts of the input sequence simultaneously.\n- Computes multiple attention-weighted representations of the input, improving performance.\n- Enables capturing diverse aspects of the input sequence, like syntactic and semantic relationships.";
const positionalEncoding = "- Since the Transformer lacks recurrence, it needs positional information about the input sequence.\n- Uses sine and cosine functions of different frequencies to encode position information.\n- Allows the model to learn relative positions and generalize to longer sequences.";
const transformerCaption = "The Transformer architecture consists of an encoder stack and a decoder stack, both composed of multiple identical layers. Each layer in the encoder stack has a multi-head self-attention layer and a position-wise feed-forward network. The decoder stack also includes a multi-head attention layer over the encoder outputs.";
const chartCaption = "The Transformer outperforms previous state-of-the-art models on both English-to-German and English-to-French translation tasks, achieving significantly higher BLEU scores.";
const trainingEfficiency = "- The Transformer trains significantly faster than RNN-based models due to its parallelizable architecture.\n- Achieves state-of-the-art results with less training time and computational resources.";
const generalization = "- The Transformer demonstrates strong generalization capabilities by achieving competitive results on English constituency parsing.\n- Shows potential for broader applications beyond machine translation.";
const summary = "- The Transformer, a novel attention-based architecture, outperforms RNN-based models in sequence transduction tasks.\n- Achieves superior translation quality, faster training, and better generalization capabilities.\n- Opens up new possibilities for efficient and parallelizable sequence modeling.";
const futureWork = "- Explore applications of the Transformer to other natural language processing tasks.\n- Investigate local and restricted attention mechanisms for handling larger inputs like images and videos.\n- Research methods for making the generation process less sequential.";